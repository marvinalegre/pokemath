import db from "../database/db.js";

const tradeDetails = (req, res) => {
  const { username, id } = req.user;

  const trades = db
    .prepare(
      "select id, recipient_id, initiator_id, status from trades where trade_ext_id = ?",
    )
    .bind(req.params.tradeId)
    .all();
  if (trades.length === 0) {
    return res.status(404).render("404");
  }

  const tradeItems = db
    .prepare(
      `
      select trade_items.user_id, user_pokemon_ext_id, pokemon_id from trade_items
      left join user_pokemons on trade_items.user_pokemon_id = user_pokemons.id
      where trade_id = ?
      `,
    )
    .bind(trades[0].id)
    .all();
  const recipientItems = tradeItems
    .filter((i) => i.user_id === trades[0].recipient_id)
    .map((i) => ({ id: i.pokemon_id, ext_id: i.user_pokemon_ext_id }));
  const initiatorItems = tradeItems
    .filter((i) => i.user_id === trades[0].initiator_id)
    .map((i) => ({ id: i.pokemon_id, ext_id: i.user_pokemon_ext_id }));

  res.render("trade-details", {
    username,
    tradeId: req.params.tradeId,
    recipientUsername: getUsername(trades[0].recipient_id),
    initiatorUsername: getUsername(trades[0].initiator_id),
    recipientPokemon: recipientItems[0],
    pokemons: initiatorItems,
    status: trades[0].status,
    showCancelBtn:
      trades[0].status === "pending" && id === trades[0].initiator_id
        ? true
        : false,
    showRecipientBtns:
      trades[0].status === "pending" && id !== trades[0].initiator_id
        ? true
        : false,
  });
};

const trades = (req, res) => {
  const { username, id } = req.user;

  let trades = db
    .prepare(
      "select trade_ext_id, recipient_id, initiator_id, pokemon_id, status from trades order by created_at desc",
    )
    .all();
  trades = trades.map((t) => ({
    id: t.trade_ext_id,
    player: getUsername(
      t.recipient_id === id ? t.initiator_id : t.recipient_id,
    ),
    status: t.status,
    pokemonId: t.pokemon_id,
  }));

  res.render("trades", {
    username,
    trades,
  });
};

const handleTrade = (req, res) => {
  let newStatus;
  if (req.body.action === "cancel") {
    newStatus = "cancelled";
  } else if (req.body.action === "reject") {
    newStatus = "rejected";
  } else if (req.body.action === "accept") {
    let proceed = true;
    const tradeItems = db
      .prepare(
        `
        select user_id, user_pokemon_id from trades
        left join trade_items on trades.id = trade_items.trade_id
        where trade_ext_id = ?
        `,
      )
      .bind(req.params.tradeId)
      .all();
    if (trades.length === 0) {
      return res.redirect("/logout");
    }

    for (const item of tradeItems) {
      const result = db
        .prepare("select * from user_pokemons where id = ? and user_id = ?")
        .bind(item.user_pokemon_id, item.user_id)
        .all();
      if (result.length === 0) {
        proceed = false;
        break;
      }
    }

    if (!proceed) {
      newStatus = "cancelled";
    }

    const [trade] = db
      .prepare("select * from trades where trade_ext_id = ?")
      .bind(req.params.tradeId)
      .all();
    tradeItems.forEach((i) => {
      if (i.user_id === trade.recipient_id) {
        db.prepare("update user_pokemons set user_id = ? where id = ?")
          .bind(trade.initiator_id, i.user_pokemon_id)
          .run();
      } else {
        db.prepare("update user_pokemons set user_id = ? where id = ?")
          .bind(trade.recipient_id, i.user_pokemon_id)
          .run();
      }
    });
    newStatus = "completed";
  }

  db.prepare("update trades set status = ? where trade_ext_id = ?")
    .bind(newStatus, req.params.tradeId)
    .run();
  res.redirect(`/trades/${req.params.tradeId}`);
};

export default {
  trades,
  tradeDetails,
  handleTrade,
};

function getUsername(id) {
  return db.prepare("select username from users where id = ?").bind(id).all()[0]
    .username;
}

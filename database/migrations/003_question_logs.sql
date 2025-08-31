DROP TABLE IF EXISTS question_log;
CREATE TABLE question_log (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    answer TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    question_code TEXT NOT NULL,
    question_parameters TEXT NOT NULL,
    submitted_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create users table
CREATE TABLE users (
    account_number VARCHAR(10) PRIMARY KEY,
    passkey VARCHAR(20),
    balance NUMERIC(10, 2)
);

-- Create transactions table
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    account_number VARCHAR(10),
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transfer_method VARCHAR(255),
    amount NUMERIC(10, 2),
    FOREIGN KEY (account_number) REFERENCES users(account_number)
);

-- Insert sample users
INSERT INTO users (account_number, passkey, balance) VALUES
('12345', 'pass123', 1500.50),
('67890', 'pass456', 3200.75);

-- Insert sample transactions
INSERT INTO transactions (account_number, transfer_method, amount) VALUES
('12345', 'ATM Withdrawal', -200.00),
('12345', 'Salary Credit', 2500.00),
('12345', 'Online Shopping', -150.50),
('67890', 'ATM Withdrawal', -300.00),
('67890', 'Utility Bill Payment', -120.75),
('67890', 'Salary Credit', 3000.00);
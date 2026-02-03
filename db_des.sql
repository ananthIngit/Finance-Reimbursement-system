
DROP TABLE IF EXISTS Approval_Logs;
DROP TABLE IF EXISTS Expenses;
DROP TABLE IF EXISTS Users CASCADE; 

CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('Employee', 'Manager', 'Finance')),
    department VARCHAR(50),
    manager_id INTEGER REFERENCES Users(id), 
    profile_pic VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- 3. Create Expenses Table
CREATE TABLE Expenses (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES Users(id),
    category VARCHAR(50) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    description TEXT,
    receipt VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Reimbursed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Approval Logs Table
CREATE TABLE Approval_Logs (
    id SERIAL PRIMARY KEY,
    expense_id INTEGER REFERENCES Expenses(id) ON DELETE CASCADE,
    reviewer_id INTEGER REFERENCES Users(id),
    remarks TEXT,
    action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    new_status VARCHAR(20)
);


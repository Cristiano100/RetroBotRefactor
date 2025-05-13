import { sql } from "bun";
import chalk from "chalk";

export type userType = {
    user_id: string;
    last_interval_check: Date;
    tix: bigint;
}

export function addUser(userId: string): Promise<boolean> {
    return sql`INSERT INTO users (user_id, last_interval_check) VALUES (${userId}, NOW())`.then((result) => {
        if (result.affectedRows === 0) {
            return false;
        }
        return true;
    }).catch((queryError) => {
        console.log(chalk.red.bold(`SQL query error: ${queryError}`));
        return false;
    });
}

export function updateLastIntervalCheck(userId: string): Promise<boolean> {
    return sql`UPDATE users SET last_interval_check = NOW() WHERE user_id=${userId}`.then((result) => {
        if (result.affectedRows === 0) {
            return false;
        }
        return true;
    }).catch((queryError) => {
        console.log(chalk.red.bold(`SQL query error: ${queryError}`));
        return false;
    });
}

export function shouldRunIntervalCheck(userId: string): Promise<boolean> {
    return sql`SELECT * FROM users WHERE user_id=${userId}`.then((result) => {
        if (result.length === 0) {
            // User not found, add them to the database
            return addUser(userId).then(() => {
                return true;
            }).catch((error) => {
                console.log(chalk.red.bold(`Error adding user: ${error}`));
                return false;
            });
        }
        const lastIntervalCheck = new Date(result[0].last_interval_check);
        const currentDate = new Date();
        const diffInMins = Math.abs(currentDate.getTime() - lastIntervalCheck.getTime()) / (1000 * 60);
        return diffInMins >= 5;
    }).catch((queryError) => {
        console.log(chalk.red.bold(`SQL query error: ${queryError}`));
        return false;
    });
}


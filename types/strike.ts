import { sql } from "bun";
import chalk from "chalk";

export type Strike = {
    strike_id: string;
    user_id: string;
    strike_reason: string;
    moderator_id: string;
    strike_date: Date;
    appeal_date: Date | null;
}

/**
 * Fetches all strikes by a user's ID from the database.
 * @param userId The ID of the user whose strikes to fetch.
 * @returns A promise that resolves to an array of Strike objects.
 */
export function getStrikesByUserId(userId: string): Promise<Strike[]> {
    return sql`
        SELECT * FROM strikes WHERE user_id = ${userId}
    `
        .then((result) => {
            return result;
        })
        .catch((queryError) => {
            console.log(chalk.red.bold(`SQL query error: ${queryError}`));
            return [];
        }
        );
}

/**
 * Fetches a strike by its ID from the database.
 * @param strikeId The ID of the strike to fetch.
 * @returns A promise that resolves to the Strike object or null if not found.
 */
export function getStrikeById(strikeId: string): Promise<Strike | null> {
    return sql`
        SELECT * FROM strikes WHERE strike_id = ${strikeId}
    `
        .then((result) => {
            if (result.length === 0) {
                return null;
            }
            return result[0];
        })
        .catch((queryError) => {
            console.log(chalk.red.bold(`SQL query error: ${queryError}`));
            return null;
        });
}

/**
    * Deletes a strike by its ID from the database.
    * @param strikeId The ID of the strike to delete.
    * @returns A promise that resolves to true if the strike was deleted, false otherwise.
    */
export function deleteStrike(strikeId: string): Promise<boolean> {
    return sql`DELETE FROM strikes WHERE strike_id = ${strikeId}`.then((result) => {
        if (result.affectedRows === 0) {
            return false;
        }
        return true;
    }).catch((queryError) => {
        console.log(chalk.red.bold(`SQL query error: ${queryError}`));
        return false;
    });
}

/*
    * Updates the appeal date of a strike in the database.
    * @param strikeId The ID of the strike to update.
    * @returns A promise that resolves to true if the strike was updated, false otherwise.
    */
export function appealStrike(strikeId: string): Promise<boolean> {
    return sql`UPDATE strikes SET appeal_date = NOW() WHERE strike_id = ${strikeId}`.then((result) => {
        if (result.affectedRows === 0) {
            return false;
        }
        return true;
    }).catch((queryError) => {
        console.log(chalk.red.bold(`SQL query error: ${queryError}`));
        return false;
    });
}

export function strikeUser(userId: string, moderatorId: string, strikeReason: string): Promise<Strike | null> {
    return sql`
        INSERT INTO strikes (strike_id, user_id, strike_reason, moderator_id, strike_date)
        VALUES (${Bun.randomUUIDv7()},${userId}, ${strikeReason}, ${moderatorId}, NOW())
    `
        .then((result) => {
            return result;
        })
        .catch((queryError) => {
            console.log(chalk.red.bold(`SQL query error: ${queryError}`));
            return null;
        });
}
import fs from 'fs/promises';
import { Challenge } from './types/grid';

const challengeRegex = /^.+\/(\d+)$/;

export const readInputFile = async (challengeId: number): Promise<Challenge> => {
    const challengePath = `../input/${challengeId}.txt`;
    const file = await fs.readFile(challengePath, 'utf-8');


}

import * as fs from 'fs/promises'
import * as path from 'path'
import { getHistoryDir } from '../configuration/historyDir'

interface ChatMessage {
    role: 'user' | 'model';
    content: { text: string }[];
}

export class ChatHistory {
    private historyFile: string;
    private history: ChatMessage[] = [];
    private maxMessages: number;

    constructor(maxMessages: number = 1000) {
        this.historyFile = path.join(getHistoryDir(), 'chat-history.json');
        this.maxMessages = maxMessages;
    }

    async load(): Promise<void> {
        try {
            await fs.access(this.historyFile);
            const data = await fs.readFile(this.historyFile, 'utf8');
            this.history = JSON.parse(data);
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
                await this.save(); // Create an empty history file
            } else {
                console.error(`Error reading chat history: ${error}`);
            }
        }
    }

    async save(): Promise<void> {
        try {
            const historyDir = path.dirname(this.historyFile);
            await fs.mkdir(historyDir, { recursive: true });
            await fs.writeFile(this.historyFile, JSON.stringify(this.history), 'utf8');
        } catch (error) {
            console.error(`Error saving chat history: ${error}`);
        }
    }

    addMessage(role: 'user' | 'model', content: string): void {
        this.history.push({ role, content: [{ text: content }] });
        if (this.history.length > this.maxMessages) {
            this.history = this.history.slice(-this.maxMessages);
        }
    }

    getHistory(): ChatMessage[] {
        return this.history;
    }

    clear(): void {
        this.history = [];
    }
}
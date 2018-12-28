export class LooService {
    private state: IAppState;
    private defaultLoo: string = "loo dog";
    constructor() {
        this.resetState();
    }

    public resetState(): IAppState {
        this.state = { loo: this.defaultLoo, users: [], queue: [] };
        return this.state;
    }

    public getUser(id: string): IAppUser {
        const user = this.state.users.find(u => u.id === id);
        if (!user) {
            throw new Error(`User with ID: ${id} not found`);
        }
        return user;
    }

    public addUserShell(id: string): IAppState {
        this.state.users.push({ id });
        return this.state;
    }

    public registerUser(name: string, id: string): IAppState {
        const user = this.state.users.find(u => u.id === id);

        if (!user) {
            return this.state;
        }

        user.name = name;

        this.state.queue = this.state.queue
            .filter(q => q.user.name === name)
            .map(q => {
                q.user = user;
                return q;
            });

        return this.state;
    }

    public removeUser(id: string): IAppState {
        this.state.users = this.state.users.filter(u => u.id !== id);
        return this.state;
    }

    public enqueue(entry: IQueueEntry): IAppState {
        this.state.queue.push(entry);
        return this.state;
    }

    public dequeue(name: string): IAppState {
        this.state.queue = this.state.queue.filter(q => q.user.name !== name);
        return this.state;
    }

    public setLooName(name?: string): IAppState {
        this.state.loo = name || this.defaultLoo;
        return this.state;
    }
}

export interface IAppUser {
    id: string;
    name?: string;
}

export interface IQueueEntry {
    user: IAppUser;
    note?: string;
}

export interface IAppState {
    loo: string;
    users: IAppUser[];
    queue: IQueueEntry[];
}

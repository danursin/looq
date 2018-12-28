"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LooService {
    constructor() {
        this.defaultLoo = "loo dog";
        this.resetState();
    }
    resetState() {
        this.state = { loo: this.defaultLoo, users: [], queue: [] };
        return this.state;
    }
    getUser(id) {
        const user = this.state.users.find(u => u.id === id);
        if (!user) {
            throw new Error(`User with ID: ${id} not found`);
        }
        return user;
    }
    addUserShell(id) {
        this.state.users.push({ id });
        return this.state;
    }
    addUser(user) {
        this.state.users.push(user);
        this.state.queue = this.state.queue
            .filter(q => q.user.name === user.name)
            .map(q => {
            q.user.id = user.id;
            return q;
        });
        return this.state;
    }
    removeUser(id) {
        this.state.users = this.state.users.filter(u => u.id !== id);
        return this.state;
    }
    enqueue(entry) {
        this.state.queue.push(entry);
        return this.state;
    }
    dequeue(id) {
        this.state.queue = this.state.queue.filter(q => q.user.id !== id);
        return this.state;
    }
    setLooName(name) {
        this.state.loo = name || this.defaultLoo;
        return this.state;
    }
}
exports.LooService = LooService;

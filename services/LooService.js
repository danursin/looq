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
    addUser(user) {
        const existingUser = this.state.users.find(u => u.id === user.id);
        if (existingUser) {
            existingUser.name = user.name;
        }
        else {
            this.state.users.push(user);
        }
        return this.state;
    }
    updateUserID(name, id) {
        const user = this.state.users.find(user => user.name === name);
        if (user) {
            user.id = id;
        }
        this.state.queue = this.state.queue
            .filter(q => q.user.name === name)
            .map(q => {
            q.user.id = id;
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

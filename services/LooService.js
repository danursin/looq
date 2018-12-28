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
    registerUser(name, id) {
        const user = this.state.users.find(u => u.id === id);
        if (!user) {
            console.log(`No user found in ${JSON.stringify(this.state.users)} with id: ${id} and name: ${name}`);
            return this.state;
        }
        console.log(`Found user ${JSON.stringify(user)} from id: ${id} and name: ${name}`);
        user.name = name;
        this.state.queue = this.state.queue
            .filter(q => q.user.name === name)
            .map(q => {
            q.user = user;
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
    dequeue(name) {
        this.state.queue = this.state.queue.filter(q => q.user.name !== name);
        return this.state;
    }
    setLooName(name) {
        this.state.loo = name || this.defaultLoo;
        return this.state;
    }
}
exports.LooService = LooService;

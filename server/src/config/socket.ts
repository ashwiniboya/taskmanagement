import { Server } from 'socket.io';
import { verifyToken } from '../middleware/auth.middleware';

export function setupSocketIO(io: Server): void {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace('Bearer ', '');
    if (!token) return next(new Error('Authentication required'));
    try {
      const decoded = verifyToken(token);
      (socket as any).user = decoded;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const user = (socket as any).user;
    socket.join(`user:${user.userId}`);
  });
}

export function emitTaskUpdate(io: Server, userId: string, event: string, payload: object): void {
  io.to(`user:${userId}`).emit(event, payload);
}

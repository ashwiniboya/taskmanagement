import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import type { Task } from '../types/task';

const SOCKET_URL = window.location.origin;

interface SocketEvents {
  onTaskCreated?: (payload: { task: Task }) => void;
  onTaskUpdated?: (payload: { task: Task }) => void;
  onTaskDeleted?: (payload: { taskId: string }) => void;
}

export function useSocket(handlers: SocketEvents) {
  const ref = useRef(handlers);
  ref.current = handlers;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      path: '/socket.io',
    });

    const onCreated = (p: { task: Task }) => ref.current.onTaskCreated?.(p);
    const onUpdated = (p: { task: Task }) => ref.current.onTaskUpdated?.(p);
    const onDeleted = (p: { taskId: string }) => ref.current.onTaskDeleted?.(p);

    socket.on('task:created', onCreated);
    socket.on('task:updated', onUpdated);
    socket.on('task:deleted', onDeleted);

    return () => {
      socket.off('task:created', onCreated);
      socket.off('task:updated', onUpdated);
      socket.off('task:deleted', onDeleted);
      socket.disconnect();
    };
  }, []);
}

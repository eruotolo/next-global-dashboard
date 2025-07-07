'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
    createTicketComment,
    deleteTicketComment,
    getTicketComments,
} from '@/actions/Settings/Tickets/commentQueries';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import useAuthStore from '@/store/authStore';

interface TicketComment {
    id: string;
    content: string;
    userId: string;
    userName: string;
    userLastName: string;
    createdAt: Date;
}

interface TicketCommentsProps {
    ticketId: string;
}

export default function TicketComments({ ticketId }: TicketCommentsProps) {
    const [comments, setComments] = useState<TicketComment[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeletingComment, setIsDeletingComment] = useState(false);
    const session = useAuthStore((state) => state.session);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<{ content: string }>();

    const isSuperAdmin = session?.user?.roles.includes('SuperAdministrador');

    const fetchComments = async () => {
        try {
            const { comments: fetchedComments, error } = await getTicketComments(ticketId);
            if (error) {
                toast.error(error);
                return;
            }
            setComments(fetchedComments);
        } catch (error) {
            console.error('Error al cargar los comentarios:', error);
            toast.error('Error al cargar los comentarios');
        }
    };

    useEffect(() => {
        fetchComments();
        // Configurar un intervalo para actualizar los comentarios cada 30 segundos
        const interval = setInterval(fetchComments, 30000);
        return () => clearInterval(interval);
    }, [ticketId]);

    const onSubmit = async (data: { content: string }) => {
        if (!session?.user?.id || !session?.user?.name || !session?.user?.lastName) {
            toast.error('Debe iniciar sesión para comentar');
            return;
        }

        if (!data.content.trim()) {
            toast.error('El comentario no puede estar vacío');
            return;
        }

        setIsLoading(true);
        try {
            const { comment, error } = await createTicketComment({
                ticketId,
                content: data.content.trim(),
                userId: session.user.id,
                userName: session.user.name,
                userLastName: session.user.lastName,
            });

            if (error) {
                toast.error(error);
                return;
            }

            if (comment) {
                // Actualizar el estado local directamente
                setComments((prevComments) => [comment, ...prevComments]);
            }

            reset();
            toast.success('Comentario agregado exitosamente');
        } catch (error) {
            console.error('Error al agregar el comentario:', error);
            toast.error('Error al agregar el comentario');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!isSuperAdmin) return;

        setIsDeletingComment(true);
        try {
            const { error } = await deleteTicketComment(commentId);
            if (error) {
                toast.error(error);
                return;
            }
            // Actualizar el estado local directamente
            setComments((prevComments) =>
                prevComments.filter((comment) => comment.id !== commentId),
            );
            toast.success('Comentario eliminado exitosamente');
        } catch (error) {
            console.error('Error al eliminar el comentario:', error);
            toast.error('Error al eliminar el comentario');
        } finally {
            setIsDeletingComment(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div
                            key={comment.id}
                            className="rounded-lg border border-gray-200 bg-gray-50/50 p-4 shadow-sm"
                        >
                            <div className="mb-2 flex items-start justify-between">
                                <div className="font-mono font-medium text-gray-900">
                                    {comment.userName} {comment.userLastName}
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="font-mono text-sm text-gray-500">
                                        {format(
                                            new Date(comment.createdAt),
                                            "d 'de' MMMM 'de' yyyy, HH:mm",
                                            { locale: es },
                                        )}
                                    </div>
                                    {isSuperAdmin && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-red-500 hover:bg-red-100 hover:text-red-700"
                                            onClick={() => handleDeleteComment(comment.id)}
                                            disabled={isDeletingComment}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <p className="font-mono text-[13px] whitespace-pre-wrap">
                                {comment.content}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No hay comentarios aún</p>
                )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <Textarea
                        {...register('content', {
                            required: 'El comentario es requerido',
                            minLength: {
                                value: 3,
                                message: 'El comentario debe tener al menos 3 caracteres',
                            },
                        })}
                        placeholder="Escribe tu comentario aquí..."
                        className="min-h-[100px] resize-y font-mono text-[13px]"
                    />
                    {errors.content && (
                        <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
                    )}
                </div>
                <div className="flex justify-end space-x-4">
                    <Button type="submit" disabled={isLoading} className="custom-button">
                        {isLoading ? 'Enviando...' : 'Enviar comentario'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

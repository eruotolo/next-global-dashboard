'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { memo } from 'react';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import {
    createTicketComment,
    deleteTicketComment,
    getTicketComments,
} from '@/actions/Settings/Tickets/commentQueries';
import { Form, TextAreaField } from '@/components/Form';
import { Button } from '@/components/ui/button';
import useAuthStore from '@/store/authStore';

import { type TicketCommentFormValues, TicketCommentSchema } from './ticketSchemas';

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

interface CommentItemProps {
    comment: TicketComment;
    isSuperAdmin: boolean;
    onDelete: (id: string) => void;
    isDeletingComment: boolean;
}

// Componente de carga optimizado
const LoadingSpinner = memo(({ message = 'Cargando...' }: { message?: string }) => (
    <output className="flex items-center justify-center py-8" aria-live="polite">
        <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
        <span className="sr-only">{message}</span>
    </output>
));

LoadingSpinner.displayName = 'LoadingSpinner';

// Componente de comentario individual optimizado
const CommentItem = memo(({
    comment,
    isSuperAdmin,
    onDelete,
    isDeletingComment,
}: CommentItemProps) => {
    const handleDelete = useCallback(() => {
        onDelete(comment.id);
    }, [onDelete, comment.id]);

    const formattedDate = useMemo(() => {
        return format(comment.createdAt, "d 'de' MMMM 'de' yyyy, HH:mm", {
            locale: es,
        });
    }, [comment.createdAt]);

    return (
        <article
            className="rounded-lg border border-gray-200 bg-gray-50/50 p-4 shadow-sm transition-shadow hover:shadow-md"
            aria-labelledby={`comment-author-${comment.id}`}
            aria-describedby={`comment-content-${comment.id}`}
        >
            <div className="mb-2 flex items-start justify-between">
                <div
                    id={`comment-author-${comment.id}`}
                    className="font-mono font-medium text-gray-900"
                >
                    {comment.userName} {comment.userLastName}
                </div>
                <div className="flex items-center gap-2">
                    <time
                        className="font-mono text-sm text-gray-500"
                        dateTime={comment.createdAt.toISOString()}
                    >
                        {formattedDate}
                    </time>
                    {isSuperAdmin && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:bg-red-100 hover:text-red-700 focus:ring-2 focus:ring-red-500"
                            onClick={handleDelete}
                            disabled={isDeletingComment}
                            aria-label={`Eliminar comentario de ${comment.userName} ${comment.userLastName}`}
                            aria-busy={isDeletingComment}
                        >
                            {isDeletingComment ? (
                                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                            ) : (
                                <Trash2 className="h-4 w-4" aria-hidden="true" />
                            )}
                            <span className="sr-only">
                                {isDeletingComment ? 'Eliminando comentario...' : 'Eliminar comentario'}
                            </span>
                        </Button>
                    )}
                </div>
            </div>
            <p
                id={`comment-content-${comment.id}`}
                className="font-mono text-[13px] whitespace-pre-wrap text-gray-700"
            >
                {comment.content}
            </p>
        </article>
    );
});

CommentItem.displayName = 'CommentItem';

// Componente para lista vacía
const EmptyCommentsList = memo(() => (
    <div className="block py-8 text-center">
        <p className="mb-2 text-gray-500">No hay comentarios aún</p>
        <p className="text-sm text-gray-400">
            Sea el primero en comentar este ticket
        </p>
    </div>
));

EmptyCommentsList.displayName = 'EmptyCommentsList';

export default function TicketComments({ ticketId }: TicketCommentsProps) {
    const [comments, setComments] = useState<TicketComment[]>([]);
    const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
    const [isLoadingComments, setIsLoadingComments] = useState(true);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [formKey, setFormKey] = useState(0);
    
    const session = useAuthStore((state) => state.session);

    const isSuperAdmin = useMemo(() => 
        session?.user?.roles.includes('SuperAdministrador') ?? false,
        [session?.user?.roles]
    );

    const fetchComments = useCallback(
        async (showLoading = true) => {
            if (showLoading) setIsLoadingComments(true);
            try {
                const { comments: fetchedComments, error } = await getTicketComments(ticketId);
                if (error) {
                    toast.error(error);
                    return;
                }
                if (fetchedComments) {
                    setComments(fetchedComments);
                }
            } catch (error) {
                console.error('Error al cargar comentarios:', error);
                toast.error('Error al cargar comentarios');
            } finally {
                setIsLoadingComments(false);
            }
        },
        [ticketId],
    );

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleCreateComment = useCallback(async (formData: FormData) => {
        if (!session?.user?.id || !session?.user?.name || !session?.user?.lastName) {
            return;
        }

        setIsSubmittingComment(true);
        try {
            const content = formData.get('content') as string;

            const { error } = await createTicketComment({
                content,
                ticketId,
                userId: session.user.id,
                userName: session.user.name,
                userLastName: session.user.lastName,
            });

            if (error) {
                toast.error('Error al agregar comentario', {
                    description: error,
                });
                return;
            }

            toast.success('Comentario agregado exitosamente');
            fetchComments(false);
            setFormKey((prev) => prev + 1);
        } catch (error) {
            console.error('Error al crear comentario:', error);
            toast.error('Error al agregar comentario');
        } finally {
            setIsSubmittingComment(false);
        }
    }, [session?.user, ticketId, fetchComments]);

    const handleSuccess = useCallback(() => {
        fetchComments(false);
        setFormKey((prev) => prev + 1);
        setIsSubmittingComment(false);
    }, [fetchComments]);

    const handleError = useCallback((error: string) => {
        toast.error('Error al agregar comentario', {
            description: error,
        });
        setIsSubmittingComment(false);
    }, []);

    const handleDeleteComment = useCallback(async (commentId: string) => {
        if (!isSuperAdmin) return;

        setDeletingCommentId(commentId);
        try {
            const { error } = await deleteTicketComment(commentId);
            if (error) {
                toast.error(error);
                return;
            }
            setComments((prevComments) =>
                prevComments.filter((comment) => comment.id !== commentId),
            );
            toast.success('Comentario eliminado exitosamente');
        } catch (error) {
            console.error('Error al eliminar el comentario:', error);
            toast.error('Error al eliminar el comentario');
        } finally {
            setDeletingCommentId(null);
        }
    }, [isSuperAdmin]);

    const submitTextLabel = useMemo(() => 
        isSubmittingComment ? 'Enviando...' : 'Enviar comentario',
        [isSubmittingComment]
    );

    const defaultValues = useMemo<Partial<TicketCommentFormValues>>(() => ({
        content: '',
    }), []);

    return (
        <div className="space-y-6">
            <section className="space-y-4" aria-label="Lista de comentarios del ticket">
                {isLoadingComments ? (
                    <LoadingSpinner message="Cargando comentarios..." />
                ) : comments.length > 0 ? (
                    <div className="space-y-3">
                        {comments.map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                isSuperAdmin={isSuperAdmin}
                                onDelete={handleDeleteComment}
                                isDeletingComment={deletingCommentId === comment.id}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyCommentsList />
                )}
            </section>

            <section aria-label="Formulario para agregar comentario">
                <Form
                    key={formKey}
                    schema={TicketCommentSchema}
                    action={handleCreateComment}
                    defaultValues={defaultValues}
                    onSuccess={handleSuccess}
                    onError={handleError}
                    submitText={submitTextLabel}
                    disabled={isSubmittingComment}
                    aria-label="Formulario de nuevo comentario"
                >
                    <TextAreaField
                        name="content"
                        label="Nuevo comentario"
                        placeholder="Escriba su comentario aquí... (mínimo 3 caracteres)"
                        className="min-h-[100px] resize-y font-mono text-[13px]"
                        required
                        disabled={isSubmittingComment}
                        aria-describedby="comment-help"
                    />
                    <div id="comment-help" className="text-muted-foreground mt-1 text-xs">
                        Su comentario se guardará y será visible para otros usuarios del ticket
                    </div>
                    {isSubmittingComment && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Enviando comentario...
                        </div>
                    )}
                </Form>
            </section>
        </div>
    );
}

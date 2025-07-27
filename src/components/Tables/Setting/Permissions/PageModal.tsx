'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { createPage, updatePage } from '@/actions/Settings/Pages/mutations';
import { getPages } from '@/actions/Settings/Pages/queries';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { ModalProps } from '@/components/Table/types/TableTypes';

interface PageFormData {
    name: string;
    path: string;
    description: string;
}

interface PageModalProps extends ModalProps {
    // Si se pasa un id, está en modo edición
    // Si no se pasa id, está en modo creación
}

export default function PageModal({ 
    id,
    open, 
    onCloseAction, 
    refreshAction
}: PageModalProps) {
    const [formData, setFormData] = useState<PageFormData>({
        name: '',
        path: '',
        description: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [editingPageId, setEditingPageId] = useState<string | null>(null);

    // Cargar datos para edición cuando se abre el modal
    useEffect(() => {
        const loadPageData = async () => {
            if (open && id) {
                // Modo edición - cargar datos de la página
                setIsLoadingData(true);
                setEditingPageId(id);
                try {
                    const pages = await getPages();
                    const pageToEdit = pages.find(page => page.id === id);
                    
                    if (pageToEdit) {
                        setFormData({
                            name: pageToEdit.name,
                            path: pageToEdit.path,
                            description: pageToEdit.description || '',
                        });
                    } else {
                        toast.error('Página no encontrada');
                        onCloseAction(false);
                    }
                } catch (error) {
                    console.error('Error loading page data:', error);
                    toast.error('Error al cargar los datos de la página');
                    onCloseAction(false);
                } finally {
                    setIsLoadingData(false);
                }
            } else if (open && !id) {
                // Modo creación - limpiar formulario
                setEditingPageId(null);
                setFormData({
                    name: '',
                    path: '',
                    description: '',
                });
            }
        };

        loadPageData();
    }, [open, id, onCloseAction]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name.trim() || !formData.path.trim()) {
            toast.error('El nombre y la ruta son obligatorios');
            return;
        }

        if (!formData.path.startsWith('/')) {
            toast.error('La ruta debe comenzar con /');
            return;
        }

        setIsSubmitting(true);
        
        try {
            if (editingPageId) {
                // Editar página existente
                await updatePage(editingPageId, formData);
                toast.success('Página actualizada correctamente');
            } else {
                // Crear nueva página
                await createPage(formData);
                toast.success('Página creada correctamente');
            }
            
            onCloseAction(false);
            await refreshAction();
            
        } catch (error) {
            console.error('Error saving page:', error);
            toast.error(editingPageId ? 'Error al actualizar la página' : 'Error al crear la página');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting && !isLoadingData) {
            onCloseAction(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {editingPageId ? 'Editar Página' : 'Crear Nueva Página'}
                    </DialogTitle>
                    <DialogDescription>
                        {editingPageId 
                            ? 'Modifica los detalles de la página existente.'
                            : 'Completa los detalles de la nueva página. La ruta debe comenzar con /.'
                        }
                    </DialogDescription>
                </DialogHeader>
                
                {isLoadingData ? (
                    <div className="space-y-4 py-4">
                        <div className="text-center">
                            <p>Cargando datos de la página...</p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Ej: Gestión de Usuarios"
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="path">Ruta *</Label>
                            <Input
                                id="path"
                                value={formData.path}
                                onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                                placeholder="Ej: /admin/users"
                                pattern="^/.*"
                                title="La ruta debe comenzar con /"
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Descripción opcional de la página"
                                rows={3}
                                disabled={isSubmitting}
                            />
                        </div>
                        
                        <DialogFooter>
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={handleClose}
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={isSubmitting}
                            >
                                {isSubmitting 
                                    ? (editingPageId ? 'Actualizando...' : 'Creando...') 
                                    : (editingPageId ? 'Actualizar' : 'Crear')
                                }
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
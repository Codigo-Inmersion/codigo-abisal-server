import { Request, Response } from "express";
import UserModel from "../models/UserModel.js";

/**
 * 🎓 EXPLICACIÓN: UserController
 * 
 * Controlador simple para gestión de usuarios por parte del admin.
 * Sigue la misma estructura que ArticleController y AuthController.
 * 
 * IMPORTANTE: Estos endpoints requieren middleware isAdmin
 */

// ========================================
// 📋 GET /users - Obtener todos los usuarios
// ========================================
export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
    try {
        // Traemos todos los usuarios pero SIN el campo password
        const users = await UserModel.findAll({
            attributes: { exclude: ['password'] } // ✅ Excluye password del resultado
        });

        if (!users || users.length === 0) {
            res.status(404).json({ message: 'No se encontraron usuarios' });
            return;
        }

        res.status(200).json(users);
    } catch (error) {
        console.error('Error obteniendo usuarios:', error);
        res.status(500).json({
            message: 'Error obteniendo usuarios',
            error
        });
    }
};

// ========================================
// 🗑️ DELETE /user/:id - Eliminar usuario
// ========================================
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // ✅ VALIDACIÓN 1: Prevenir auto-eliminación
        // req.user viene del middleware verifyToken
        if (req.user && Number(req.user.userId) === Number(id)) { // (Convierte ambos a number)
            res.status(403).json({
                message: "No puedes eliminar tu propia cuenta"
            });
            return;
        }

        // ✅ VALIDACIÓN 2: Verificar que el usuario existe
        const user = await UserModel.findByPk(id);

        if (!user) {
            res.status(404).json({ message: "Usuario no encontrado" });
            return;
        }

        // ✅ Eliminar el usuario
        const deleted = await UserModel.destroy({
            where: { id }
        });

        if (deleted === 0) {
            res.status(404).json({ message: "No se pudo eliminar el usuario" });
            return;
        }

        res.status(200).json({
            message: "Usuario eliminado correctamente",
            deletedUserId: Number(id),
            deletedUsername: user.username
        });
    } catch (error) {
        console.error('Error eliminando usuario:', error);
        res.status(500).json({
            message: "No se pudo eliminar el usuario",
            error
        });
    }
};

// ========================================
// ✏️ PUT /user/:id - Actualizar usuario
// ========================================

// Tipo para los campos que pueden actualizarse
interface UpdateUserDTO {
    username?: string;
    name?: string;
    last_name?: string;
    email?: string;
    role?: string;
}

export const updateUser = async (
    req: Request<{ id: string }, unknown, UpdateUserDTO>,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;

        // ✅ VALIDACIÓN 1: Verificar que no se intente actualizar password
        if ('password' in req.body) {
            res.status(400).json({
                message: 'No puedes actualizar la contraseña desde este endpoint. Usa /auth/reset-password'
            });
            return;
        }

        // ✅ VALIDACIÓN 2: Verificar que el usuario existe
        const user = await UserModel.findByPk(id);

        if (!user) {
            res.status(404).json({ message: "Usuario no encontrado" });
            return;
        }

        // ✅ VALIDACIÓN 3: Si se cambia el rol, verificar que sea válido
        const { role, email, username, name, last_name } = req.body;

        if (role && !['user', 'admin'].includes(role)) {
            res.status(400).json({
                message: 'El rol debe ser "user" o "admin"'
            });
            return;
        }

        // ✅ VALIDACIÓN 4: Si se cambia el email, verificar que no exista
        if (email) {
            const normalizedEmail = email.toLowerCase().trim();

            const existingUser = await UserModel.findOne({
                where: { email: normalizedEmail }
            });

            // Verificar que el email no pertenezca a otro usuario
            if (existingUser && existingUser.id !== user.id) {
                res.status(409).json({
                    message: "Este email ya está en uso por otro usuario"
                });
                return;
            }
        }

        // ✅ VALIDACIÓN 5: Si se cambia el username, verificar que no exista
        if (username) {
            const normalizedUsername = username.toLowerCase().trim();

            const existingUsername = await UserModel.findOne({
                where: { username: normalizedUsername }
            });

            // Verificar que el username no pertenezca a otro usuario
            if (existingUsername && existingUsername.id !== user.id) {
                res.status(409).json({
                    message: "Este nombre de usuario ya está en uso"
                });
                return;
            }
        }

        // ✅ Actualizar el usuario (solo los campos enviados)
        await user.update({
            username,
            name,
            last_name,
            email: email ? email.toLowerCase().trim() : undefined,
            role
        });

        // ✅ Devolver el usuario actualizado sin password
        const updatedUser = await UserModel.findByPk(id, {
            attributes: { exclude: ['password'] }
        });

        res.status(200).json({
            message: "Usuario actualizado correctamente",
            user: updatedUser,
        });
    } catch (error) {
        console.error('Error actualizando usuario:', error);
        res.status(500).json({
            message: "Error actualizando el usuario",
            error
        });
    }
};

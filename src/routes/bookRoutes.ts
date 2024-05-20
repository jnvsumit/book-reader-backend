import { Router } from 'express';
import { getBooks, getBookDetails, getBookPage, updateBookPage, createBook, deleteBook } from '../controllers/bookController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();

router.get('/', getBooks);
router.get('/:bookId', getBookDetails);
router.get('/:bookId/pages/:pageNumber', getBookPage);
router.put('/:bookId/pages/:pageNumber', authenticateJWT, authorizeRoles(['USER', 'ADMIN']), updateBookPage);
router.post('/', authenticateJWT, authorizeRoles(['USER', 'ADMIN']), createBook);
router.delete('/:bookId', authenticateJWT, authorizeRoles(['USER', 'ADMIN']), deleteBook);

export default router;

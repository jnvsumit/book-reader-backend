import { Router } from 'express';
import { getBooks, getBookDetails, getBookPage, updateBookPage } from '../controllers/bookController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();

router.get('/', getBooks);
router.get('/:bookId', getBookDetails);
router.get('/:bookId/pages/:pageNumber', getBookPage);
router.put('/:bookId/pages/:pageNumber', authenticateJWT, authorizeRoles(['USER', 'ADMIN']), updateBookPage);

export default router;

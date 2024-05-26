import { Router } from 'express';
import { getBooks, getBookDetails, updateBook, postBook, deleteBook } from '../controllers/bookController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();

router.get('/', getBooks);
router.get('/:bookId', getBookDetails);
router.put('/:bookId', updateBook);
router.post('/', postBook);
router.delete('/:bookId', deleteBook);

export default router;

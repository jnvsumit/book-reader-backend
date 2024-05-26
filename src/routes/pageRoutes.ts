import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';
import { addPage, deletePage, getPageById, getPagesByBookId, updatePage } from '../controllers/pageController';

const router = Router();

router.get('/:bookId', getPagesByBookId);
router.get('/fetch/:pageId', getPageById);
router.put('/:pageId', updatePage);
router.post('/:bookId', addPage);
router.delete('/:pageId', deletePage);

export default router;

import { Router } from 'express';
import { createDonation, getDonations } from '../controllers/donationController';

const router = Router();

router.post('/', createDonation);
router.get('/', getDonations);

export default router;

const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');


router.get('/getallbooksdata', bookController.getAllBooks);

router.post('/getspecificbooksdata', bookController.getSpecificBooks);

router.post('/getsinglebookdata', bookController.getSingleBook);

router.post('/issuebook',bookController.issueBook)

router.post('/returnbook',bookController.returnBook)

router.post('/reissuebook',bookController.reIssueBook)



module.exports = router;

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function (req, res, next) {
  try {
    console.log(req.body)
    res.status(200).send("ok");
    // let message = generateMessage(req.body);
    // res.status(200).send(message);
  } catch (err) {
    res.status(500).send(err);
    console.error(err);
  }
});

function generateMessage(payload) {
  const action = payload.action;
  const issueNumber = payload.issue.number;
  const issueTitle = payload.issue.title;
  const sender = payload.sender.login;

  let message;
  if (action === 'opened') {
    const issueDescription = payload.issue.body
      ? `\n\n${payload.issue.body}`
      : ' without a description.';
    const createdAt = new Date(payload.issue.created_at).toLocaleString();
    const commentsCount = payload.issue.comments;
    const issueLink = payload.issue.html_url;
    let mediaMessage = '';
    if (payload.issue.media && payload.issue.media.length > 0) {
      mediaMessage = '\n\nMedia attached:';
      payload.issue.media.forEach((media, index) => {
        mediaMessage += `\n${index + 1}. [${media.name}](${media.url})`;
      });
    }

    message =
      `Issue #${issueNumber} (${issueTitle}) created by ${sender} on ${createdAt}.${issueDescription}\n\n` +
      `This issue has ${commentsCount} comment${
        commentsCount !== 1 ? 's' : ''
      }.` +
      `${mediaMessage}\n[Link to the issue](${issueLink})`;
  } else if (action === 'closed') {
    const closedBy = payload.issue.closed_by
      ? ` by ${payload.issue.closed_by.login}`
      : '';
    const closedAt = new Date(payload.issue.closed_at).toLocaleString();
    const commentsCount = payload.issue.comments;
    const issueLink = payload.issue.html_url;

    let commentMessage = '';

    if (payload.comment) {
      const commentBody = payload.comment.body;
      const commentAuthor = payload.comment.user.login;
      const commentCreatedAt = new Date(
        payload.comment.created_at
      ).toLocaleString();

      commentMessage = `\n\nComment by ${commentAuthor} at ${commentCreatedAt}:\n${commentBody}`;
    }

    message =
      `Issue #${issueNumber} (${issueTitle}) closed${closedBy} on ${closedAt}.` +
      `\n\nThis issue had ${commentsCount} comment${
        commentsCount !== 1 ? 's' : ''
      }.${commentMessage}` +
      `\n[Link to the issue](${issueLink})`;
  } else if (action === 'created') {
    const commentBody = payload.comment.body;
    const commentAuthor = payload.comment.user.login;
    const commentCreatedAt = new Date(
      payload.comment.created_at
    ).toLocaleString();
    const issueLink = payload.issue.html_url;

    message =
      `New comment by ${commentAuthor} on Issue #${issueNumber} (${issueTitle}) at ${commentCreatedAt}:\n\n${commentBody}` +
      `\n\n[Link to the issue](${issueLink})`;
  } else if (action === 'labeled') {
    const labelName = payload.label.name;
    message = `Label '${labelName}' added to Issue #${issueNumber} (${issueTitle}) by ${sender}.`;
  } else if (action === 'assigned') {
    const assignee = payload.assignee.login;
    message = `Issue #${issueNumber} (${issueTitle}) assigned to ${assignee} by ${sender}.`;
  } else if (action === 'unassigned') {
    message = `Assignee removed from Issue #${issueNumber} (${issueTitle}) by ${sender}.`;
  }
  console.log(message);
  return message;
}

module.exports = router;

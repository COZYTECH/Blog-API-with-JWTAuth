let comments = [
  { id: 1, text: "Great post!" },
  { id: 2, text: "Very informative." },
  { id: 3, text: "welcome guys" },
];

export const commentController = (req, res) => {
  // adding new comments
  const { text } = req.body;
  const newComment = { id: comments.length + 1, text };
  comments.push(newComment);
  res.status(201).json(newComment);
};

export const updateCommentControllerById = (req, res) => {
  const comment = comments.findIndex((i) => i.id === parseInt(req.params.id));
  if (!comment) return res.status(404).send("comment not found");
  comments.text = req.body.text;
  res.json({ message: `${comments.text}` });
};

export const getAllComment = (req, res) => {
  res.json(comments);
};

export const deleteCommentById = (req, res) => {
  const commentIndex = comments.findIndex(
    (i) => i.id === parseInt(req.params.id)
  );
  if (commentIndex === -1) return res.status(404).send("comment not found");
  //const word = comments.text;
  const deletedItem = comments.splice(commentIndex, 1);
  res.json({ message: `these comment ${deletedItem} has been deleted` });
};

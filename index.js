import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("welcome to my blog api project");
});

let comments = [
  { id: 1, text: "Great post!" },
  { id: 2, text: "Very informative." },
];
// adding new comments
app.post("/api/comments", (req, res) => {
  const { text } = req.body;
  const newComment = { id: comments.length + 1, text };
  comments.push(newComment);
  res.status(201).json(newComment);
});
//update comment by id
app.put("/api/comments/:id", (req, res) => {
  const comment = comments.findIndex((i) => i.id === parseInt(req.params.id));
  if (!comment) return res.status(404).send("comment not found");

  comments.text = req.body.text;
  res.json({ message: `${comments.text}` });
});
// get all comments
app.get("/api/comments", (req, res) => {
  res.json(comments);
});
// delete comment by id
app.delete("/api/comments/:id", (req, res) => {
  const commentIndex = comments.findIndex(
    (i) => i.id === parseInt(req.params.id)
  );
  if (commentIndex === -1) return res.status(404).send("comment not found");
  //const word = comments.text;
  const deletedItem = comments.splice(commentIndex, 1);
  res.json({ message: `these comment ${deletedItem} has been deleted` });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

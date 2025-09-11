let blog = [
  {
    id: 1,
    title: "My First Blog Post",
    content: "This is the content of my first blog post.",
  },
  {
    id: 2,
    title: "Another Blog Post",
    content: "Here's some more content for another blog post.",
  },
  {
    id: 3,
    title: "Learning Express",
    content: "Express is a web framework for Node.js.",
  },
];

export const createBlogPost = (req, res) => {
  const { title, content } = req.body;
  const newBlog = { id: blog.length + 1, title, content };
  blog.push(newBlog);
  res.status(201).json(newBlog);
};
export const getAllBlogPost = (req, res) => {
  res.send(blog);
};

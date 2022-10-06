const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../modals/User");

// Update User
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(16);

        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(500).json(error);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });

      res.status(200).json("Account has been Updated!");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You can Update only your Account");
  }
});

// Delete User
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete({ _id: req.params.id });

      res.status(200).json("Account has been Deleted Successfully!");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You can Delete only your Account");
  }
});

// Get an User
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;

    res.status(200).json(other);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Follow an User
router.put("/:id/follow", async (req, res) => {
  try {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);

        if (!user.followers.includes(req.body.userId)) {
          await user.updateOne({ $push: { followers: req.body.userId } });

          await currentUser.updateOne({
            $push: { following: req.params.id },
          });

          res.status(200).json("User has been followed");
        } else {
          res.status(403).json("You already follow this User");
        }
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(403).json("You can't follow yourself");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// Unfollow an User
router.put("/:id/unfollow", async (req, res) => {
  try {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);

        if (user.followers.includes(req.body.userId)) {
          await user.updateOne({ $pull: { followers: req.body.userId } });

          await currentUser.updateOne({
            $pull: { following: req.params.id },
          });

          res.status(200).json("User has been unfollowed");
        } else {
          res.status(403).json("You are not following this User");
        }
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(403).json("You can't unfollow yourself");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;

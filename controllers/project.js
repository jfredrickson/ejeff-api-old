const Project = require("../models/project")

module.exports = {

  get: (req, res) => {
    Project.find({}, (err, result) => {
      if (err) {
        res.send(err)
      } else {
        res.json(result)
      }
    })
  },

  post: (req, res) => {
    let newProject = new Project(req.body)
    newProject.save((err, project) => {
      if (err) {
        res.send(err)
      } else {
        res.json({ message: "Added project.", project })
      }
    })
  }

}

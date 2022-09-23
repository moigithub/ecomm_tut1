import fileUpload from 'express-fileupload'
const app = express()
app.use(fileUpload())

app.use('/upload', (req, res) => {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.')
  }

  const file = req.files.avatar
  const path = process.cwd() + '/uploads/' + file.name

  //move to new folder
  file.mv(path, err => {
    if (err) {
      return res.status(500).send(err)
    }
    return res.send({ status: 'success', path: path })
  })
})

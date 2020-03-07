const fs = require('fs')

const fetchRepoIssue = require('./fetchRepoIssue')
const reStructureJson = require('./reStructureJson')

const TOP = `
<h1 align="center">日常技术摘录 👋</h1>
---
`
module.exports = async () => {
  const issues = await fetchRepoIssue()

  if (!issues) {
    console.log('Get the data faild. Please check.')
    console.log(JSON.stringify(issues))
    process.exit(1)
  }
  const result = reStructureJson(issues)
  const README = []
  README.push(TOP)
  
  Object.keys(result).forEach(cateGory => {
    const cateGoryData = result[cateGory]
    const readme = []
    const name = cateGoryData[0].displayLabel

    cateGoryData.forEach(data => {
      readme.push(`
        - [${data.name}](${data.issueUrl})
      `)
    })
    
    const template = `
      <details>
        <summary>${name}<sup>${cateGoryData.length}</sup></summary>
        ${readme.join('')}
      </details>
    `

    README.push(template)
  })

  const RemoveSpace = /^\s{5}/gmi
  

  fs.writeFileSync('README.md', README.join('\n').replace(RemoveSpace, ''))
}
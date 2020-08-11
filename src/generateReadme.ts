import * as fs from 'fs'
import * as path from 'path'
import { refactoringData } from './refactoringData'
import { fetchIssues } from './fetchIssues'
import { Issues } from './simplifyIssue'

const DefaultReadme: string =
  '<h1 align="center">日常技术文档归档 👋<a href="https://biyuqi.github.io/snippets/">Online</a></h1>'
const RemoveSpace: RegExp = /^\s{5}/gim

export async function generateReadme() {
  const README = []
  const issues: Array<Issues> = await fetchIssues()

  if (!issues) {
    console.log('Get the issue faild. Please check.')
    process.exit(1)
  }

  const result = refactoringData(issues)
  README.push(DefaultReadme)

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

  const cwd = process.cwd()
  const ensureExist = fs.existsSync(path.resolve(cwd, 'dist'))

  if (!ensureExist) {
    fs.mkdirSync(path.resolve(cwd, 'dist'))
  }
  try {
    fs.writeFileSync(
      path.resolve(cwd, 'dist/README.md'),
      README.join('\n').replace(RemoveSpace, '')
    )
    fs.writeFileSync(path.resolve(cwd, 'dist/snippets.json'), JSON.stringify(result))
  } catch (error) {
    console.log(error)
  }
}

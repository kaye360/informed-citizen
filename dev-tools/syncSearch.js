
import fs from 'fs'

const articleDirectory = '../src/articles'
const writeFile = '../public/assets/json/searchResults.json'
const searchResultJSON = []

try {
  const files = fs.readdirSync(articleDirectory)
  
  files.forEach( file => {

    if (!file.endsWith('.md')) return

    const fileData = fs.readFileSync(`${articleDirectory}/${file}`, 'utf-8')
    
    let title = false
    let excerpt = false
    let tags = []
    let uri = false
    
    fileData.split(/\r?\n/).forEach( line => {

      if (line.startsWith('title')) title = line.split(': ')[1]
      if (line.startsWith('excerpt')) excerpt = line.split(': ')[1]
      if (line.startsWith('  -')) tags.push(line.split('- ')[1])
      if (line.startsWith('uri')) uri = line.split(': ')[1]
  
    })
  
    searchResultJSON.push({title, excerpt, tags, uri})
  })
  
  fs.writeFileSync(writeFile, JSON.stringify(searchResultJSON))
  console.log('Updated search results JSON file successfully')

} catch (err) {
  console.log(err)
}

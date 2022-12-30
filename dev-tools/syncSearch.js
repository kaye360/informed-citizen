/**
 * 
 * syncSearch.js
 * Synchronize search result data with current article data
 * 
 * Astro doesn't have a built in search function. So
 * this script grabs frontmatter data from all articles
 * and converts this data to a json file. This file can
 * then be fetched from the front end with a url query.
 * 
 */

import fs from 'fs'

const articleDirectory = '../src/articles'
const writeFile = '../public/assets/json/searchResults.json'
const searchResultJSON = []

try {

  // Loop thru article files directory
  const files = fs.readdirSync(articleDirectory)
  files.forEach(file => {

    if (!file.endsWith('.md')) return
  
    let title
    let excerpt
    let tags = []
    let uri

    // Loop thru file lines and extract frontmatter data
    const fileData = fs.readFileSync(`${articleDirectory}/${file}`, 'utf-8')
    fileData.split(/\r?\n/).forEach(line => {

      if (line.startsWith('title')) title = line.split(': ')[1].trim()
      if (line.startsWith('excerpt')) excerpt = line.split(': ')[1].trim()
      if (line.startsWith('uri')) uri = line.split(': ')[1].trim()
      if (line.startsWith('  -')) tags.push(line.split('- ')[1])

    })

    tags.forEach((tag, index) => tags[index] = tag.trim())

    if (!title || !excerpt || !uri || tags.length === 0) {
      throw new Error(`Error: Missing frontmatter param in file ${file}`)
    }

    searchResultJSON.push({ title, excerpt, tags, uri })
  })

  fs.writeFileSync(writeFile, JSON.stringify(searchResultJSON))
  console.log('Updated search results JSON file successfully')

} catch (err) {
  console.log(err.message)
}

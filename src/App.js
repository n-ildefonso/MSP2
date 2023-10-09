import { useEffect, useState } from 'react'

function App(){
    let [search, setSearch] = useState('')
    let [message, setMessage] = useState('Search for Pokemon!')
    let [data, setData] = useState([])

    useEffect(() => {
      const fetchData = async () => {
          document.title = `${search} Pokemon`
          const response = await fetch('https://pokeapi.co/api/v2/pokemon/search?term=')
          const resData = await response.json()
          if (resData.results.length > 0) {
              setData(resData.results)
          } else {
              setMessage('Not Found')
          }
      }
      fetchData()
  }, [search])
  
    return (
        <div>

        </div>
    )
}

export default App


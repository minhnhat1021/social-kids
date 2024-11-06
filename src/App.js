import React, { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import Modal from 'react-modal'

import axios from 'axios'

import './App.css'

Modal.setAppElement('#root') 

function App() {
    const [dataTest, setDataTest] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [searchByName, setSearchByName] = useState('')
    const [languageFilter, setLanguageFilter] = useState('')
    const [currentPage, setCurrentPage] = useState(0)
    const [selectedData, setSelectedData] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    console.log(dataTest)
    console.log('owner:', dataTest[0]?.owner)

    const countItem = 5

    useEffect(() => {

      const fetchApi = async () => {
        const res = await axios.get('https://api.github.com/users/freeCodeCamp/repos')

        setDataTest(res.data)
        setFilteredData(res.data)
      }

      fetchApi()
    }, [])

    useEffect(() => {

        const regex = new RegExp(searchByName, 'i')
        const filtered = dataTest.filter(
            (data) => regex.test(data.name) && (!languageFilter || data.language === languageFilter)

        )
        setFilteredData(filtered)
    }, [searchByName, languageFilter, dataTest])

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected)
    }

    const handleRowClick = (data) => {
        setSelectedData(data.owner)
        setIsModalOpen(true)
    }

    const offset = currentPage * countItem
    const currentPageData = filteredData.slice(offset, offset + countItem)

    return (
        <div className="App">
            <h1>Test Social Kids</h1>

            <input
                type="text"
                placeholder="Tìm kiếm theo tên"
                value={searchByName}
                onChange={(e) => setSearchByName(e.target.value)}
            />

            <select value={languageFilter} onChange={(e) => setLanguageFilter(e.target.value)}>
                <option value="">Tất cả ngôn ngữ</option>
                {[...new Set(dataTest.map((data) => data?.language))].filter(Boolean).map((language) => (
                      <option key={language} value={language}>
                          {language}
                      </option>
                ))}
                    
            </select>

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Language</th>
                        <th>Forks count</th>
                    </tr>
                </thead>
                <tbody>
                    {currentPageData.map((data) => (
                        <tr key={data?.id} onClick={() => handleRowClick(data)}>
                            <td>{data?.name}</td>
                            <td>{data?.description}</td>
                            <td>{data?.language}</td>
                            <td>{data?.forks_count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <ReactPaginate
                previousLabel={'<- Trước'}
                nextLabel={'Sau->'}
                pageCount={Math.ceil(filteredData.length / countItem)}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                activeClassName={'active'}
            />

            {selectedData && (
                <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
                    <h2>Thông tin Owner</h2>
                    <img src={selectedData?.avatar_url} alt="Avatar" width={100} />
                    <p>Login: {selectedData?.login}</p>
                    <p>Type: {selectedData?.type}</p>
                    <button onClick={() => setIsModalOpen(false)}>Đóng</button>
                </Modal>
            )}
        </div>
    )
}

export default App


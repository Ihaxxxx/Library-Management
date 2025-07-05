import {Routes, Route } from 'react-router-dom'
import LoginPage from '../src/pages/LoginPage'
import RegisterAdminPage from '../src/pages/RegisterAdminPage'
import Dashboard from './pages/Home'
import Books from './pages/Books'
import AddCustomer from './pages/AddCustomer'
import IssueBook from './pages/IssueBook'
import ReturnBook from './pages/Return Book'
import ReIssue from './pages/ReIssue'
import IssueBookWithId from './pages/IssueBookWithId'
function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<LoginPage/>} />
        <Route path='/registeradmin' element={<RegisterAdminPage/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/books' element={<Books/>} />
        <Route path='/addcustomer' element={<AddCustomer/>} />
        <Route path='/addcustomer' element={<AddCustomer/>} />
        <Route path='/issuebook' element={<IssueBook/>} />
        <Route path='/issuebook/:bookid' element={<IssueBookWithId/>} />
        <Route path='/returnbook' element={<ReturnBook/>} />
        <Route path='/reissue' element={<ReIssue/>} />
      </Routes>
    </>
  )
}

export default App

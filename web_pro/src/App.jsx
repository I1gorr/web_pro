import './App.css'
import AboutSection from './AboutSection'
import Signin from './SignIn'
function App() {
  return (
    <>
    <div id="root"> {/* Ensure correct structure */}
      <div className='TitleName'>
        <h1 className='pixel-font' style={{ color: 'white' }}>EDUSHARE</h1>
      </div>
      <AboutSection></AboutSection>
      <Signin></Signin>
    </div>
    </>
  )
}

export default App

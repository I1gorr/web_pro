import './heropage.css'
import AboutSection from './AboutSection'
import Signin from './SignIn'
function Heropage() {
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

export default Heropage;

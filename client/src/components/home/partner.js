import adata from '../../images/adata.png';
import gigabyte from '../../images/gigabyte.png';
import hewlett from '../../images/hewlett.png';
import msi from '../../images/msi.png';
import razer from '../../images/razer.png';
import rocat from '../../images/rocat.png';
import thermable from '../../images/thermable.png';
import './home.scss'

const Partners = () => {
    return(
        <div className='partner-block'>
            <img src={rocat} alt='rocat' />
            <img src={msi} alt='msi' />
            <img src={razer} alt='razer' />
            <img src={thermable} alt='threma' />
            <img src={adata} alt='adata' />
            <img src={hewlett} alt='hewlett' />
            <img src={gigabyte} alt='gigabyte' />
        </div>
    )
}

export default Partners
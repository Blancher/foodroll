import images from '../images/images';

export default function Die(props) {
    return <div className='dies' style={{backgroundImage: `url(${images[props.val - 1]})`, backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed', backgroundPosition: 'center', backgroundSize: 'cover', border: props.bool && '3px solid #59E391'}} onClick={props.onClick}></div>;
}
import { useNavigate, useParams } from 'react-router-dom';

export const withRouter = (Component) => {
    const Wrapper = (props) => {
        const navigate = useNavigate();
        const params = useParams();

        return (
            <Component
                navigate={navigate}
                params={params}
                {...props}
            />
        );
    };

    return Wrapper;
};
// FOR react-router-dom, USE THIS TO ROUTE TO ANOTHER COMPONENT AFTER RECEIVING A HTTP RESPONSE FROM SERVER
// In your component add the following import:
// import { withRouter } from '../withRouter';
// then use:
// this.props.navigate('/componentpath')

//refer to Home component for example 
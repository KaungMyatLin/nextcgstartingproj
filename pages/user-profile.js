const userProfilePage = (props) => {
    return (
        <div>userProfilePage</div>
    )
}

export default userProfilePage

export async function getServerSideProps(context) {
    const { params, req, res } = context;
    console.log( req)
    
    return {
        props: {
            username: 'Mx'
        }
    }
}
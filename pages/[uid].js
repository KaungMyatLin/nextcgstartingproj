const userProfilePage = (props) => {
    return (
        <div>{ props.id } </div>
    )
}

export default userProfilePage

export async function getServerSideProps(context) {
    const { params, req, res } = context;
    console.log( req)
    const usrId = params.uid
    return {
        props: {
            id: 'userId-' + usrId
        }
    }
}
import React, { use, useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/Authcontext'
import { useNavigate } from 'react-router-dom'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import { IconButton } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';


const History = () => {



    const { getHistoryUser } = useContext(AuthContext)
    const [meetings, setMeetings] = useState([])

    const routeTo = useNavigate()

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryUser();
                setMeetings(history)
            } catch (error) {
                console.log(error);
            }
        }
        fetchHistory()
    }, [])

    let formateDate = (dateString) => {
        const date = new Date(dateString)
        const day = date.getDate().toString().padStart(2, "0")
        const month = (date.getMonth() + 1).toString().padStart(2, "0")
        const year = date.getFullYear();

        return `${day}/${month}/${year}`
    }

    return (
        <div style={{marginLeft:"5px"}}>
            <IconButton style={{ marginTop: '10px', marginBottom: '10px' }} onClick={() => {
                routeTo('/home')
            }}>
                <HomeIcon />
            </IconButton>
            <h1 style={{marginBottom:'15px'}}>Your Meeting</h1>
                {  meetings.length !==0 ?
                    meetings.map((e, i) => {
                        return (
                            <>
                                <Card key={i} variant="outlined">
                                    <CardContent>
                                        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                                            Code:{e.meetingCode}
                                        </Typography>
                                        <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>Date:{formateDate(e.date)}</Typography>
                                    </CardContent>
                                </Card>
                            </>
                        )
                    }):
                    <>
                    <h1 style={{marginLeft:'20px'}}><SearchOffIcon/>No meeting Present</h1>
                    </>
                }
        </div>
    )
}

export default History
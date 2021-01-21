import React,{useState} from 'react';
import { connect } from 'react-redux';
import {useRouter} from 'next/router';
import styles from '../styles/Meetings.module.css';
import moment from 'moment';
import {FacebookShareButton,FacebookIcon,WhatsappShareButton,WhatsappIcon,TelegramShareButton,TelegramIcon,LinkedinShareButton,LinkedinIcon} from 'react-share';
import HostModal from './HostModal';
import DialogBox from './DialogBox';
import { deleteMeeting,startMeeting } from '../redux/meeting/actions';

const MeetingCard = ({meeting,user,deleteMeeting,startMeeting}) => {
    const {title,datetime,id,password,createdAt} = meeting;
    const [showEdit,setShowEdit]= useState(false);
    const [showDelete,setShowDelete]= useState(false);
    const invite = `*Wedeo Meeting Invitation* \n\n ${user.name} is inviting you to attend a meeting. \n\n *Meeting Details* \n Title: ${title} \n Timing : ${datetime} \n ID : ${id} \n Password : ${password} \n\n\n Regards, \n *Team Wedeo*`;
    const router = useRouter();
    const startMeetingHandler = async ()=>{
       await startMeeting(meeting);
       router.push({pathname:'/meeting',query:{id:meeting.id,password:meeting.password}});
    }
    
    return (
        <>
        <div className={styles.card}>
            <div className={styles.editButton} onClick={()=>{setShowEdit(true)}}><i class="fa fa-pencil" aria-hidden="true"></i></div>
            <div className={styles.deleteButton} onClick={()=>{setShowDelete(true)}}><i class="fa fa-trash" aria-hidden="true"></i></div>
                <div className={styles.cardImg}>
                    { new Date()>new Date(datetime) &&
                    <div className={styles.overlay}>
                        <div className={styles.startButton} onClick={startMeetingHandler}>
                            Start Meeting
                        </div>
                    </div>
                    }
                    <img className={styles.cardImgImg} src="/static/images/video-call.svg" alt="meeting-image"/>
                </div>
                <div className={styles.cardContent}>
                    <p className={styles.meta}><strong>Title</strong> : {title}</p>
                    <p className={styles.meta}><strong>Timing</strong> : {moment(datetime).format('lll')}</p>
                    <p className={styles.meta}><strong>ID</strong> : {id}</p>
                    <p className={styles.meta}><strong>Password</strong> : {password}</p>
                    <p className={styles.created}>created {moment(new Date(createdAt)).fromNow()}</p>
                </div>
                <div className={styles.socialShare}>
                <WhatsappShareButton className={styles.socialIcon} url={'https://localhost:3000'} title={invite}><WhatsappIcon size={40} borderRadius={20} /></WhatsappShareButton> <TelegramShareButton className={styles.socialIcon} url={'https://localhost:3000'} title={invite}><TelegramIcon size={40} borderRadius={20}/></TelegramShareButton> <FacebookShareButton className={styles.socialIcon} url={'https://localhost:3000'} quote={invite}><FacebookIcon size={40} borderRadius={20}/></FacebookShareButton> <LinkedinShareButton className={styles.socialIcon} url={'https://localhost:3000'} source={'https://localhost:3000'} quote={invite}><LinkedinIcon size={40} borderRadius={20}/></LinkedinShareButton>
                </div>
            </div>
            <HostModal show={showEdit} onClose={()=>{setShowEdit(false)}} edit={true} mId={id}/>
            <DialogBox show={showDelete} clickOk={()=>{deleteMeeting(id);setShowDelete(false)}} clickCancel={()=>{setShowDelete(false)}} question={"Are you sure you want to delete the meeting?"} />
            </>
    )
}

const mapStateToProps = ({auth})=>({
    user:auth.user
});

export default connect(mapStateToProps,{deleteMeeting,startMeeting})(MeetingCard);
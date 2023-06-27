import { Col, Row, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllExams } from '../../../apicalls/exams';
import PageTitle from '../../../components/PageTitle';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';

function Home() {
	const [exams, setExams] = useState([]);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { user } = useSelector(state => state.users);

	const getExams = async () => {
		try {
			dispatch(ShowLoading());
			const response = await getAllExams();
			if (response.success) {
				setExams(response.data);
			} else {
				message.error(response.message);
			}
			dispatch(HideLoading());
		} catch (error) {
			dispatch(HideLoading());
			message.error(error.message);
		}
	};

	useEffect(() => {
		getExams();
		// eslint-disable-next-line
	}, []);
	return (
		user && (
			<div>
				<PageTitle title={`Salom ${user?.name}, Xush kelibsiz Orbitalga`} />
				<div className='divider'></div>

				<Row gutter={[16, 16]}>
					{exams.map(exam => (
						<Col span={6}>
							<div className='card-lg flex flex-col gap-1 p-2'>
								<h1 className='text-2xl'>{exam?.name}</h1>
								<h1 className='text-md'>Kategoriya : {exam.category}</h1>
								<h1 className='text-md'>Jami ball : {exam.totalMarks}</h1>
								<h1 className='text-md'>O'tish ball : {exam.passingMarks}</h1>
								<h1 className='text-md'>Davomiyligi : {exam.duration}</h1>

								<button
									className='primary-outlined-btn'
									onClick={() => navigate(`/user/write-exam/${exam._id}`)}
								>
									Imtihonni boshlash
								</button>
							</div>
						</Col>
					))}
				</Row>
			</div>
		)
	);
}

export default Home;

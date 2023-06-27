import { Table, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteExamById, getAllExams } from '../../../apicalls/exams';
import PageTitle from '../../../components/PageTitle';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';

function Exams() {
	const navigate = useNavigate();
	const [exams, setExams] = useState([]);
	const dispatch = useDispatch();

	const getExamsData = async () => {
		try {
			dispatch(ShowLoading());
			const response = await getAllExams();
			dispatch(HideLoading());
			if (response.success) {
				setExams(response.data);
			} else {
				message.error(response.message);
			}
		} catch (error) {
			dispatch(HideLoading());
			message.error(error.message);
		}
	};

	const deleteExam = async examId => {
		try {
			dispatch(ShowLoading());
			const response = await deleteExamById({
				examId,
			});
			dispatch(HideLoading());
			if (response.success) {
				message.success(response.message);
				getExamsData();
			} else {
				message.error(response.message);
			}
		} catch (error) {
			dispatch(HideLoading());
			message.error(error.message);
		}
	};

	const columns = [
		{
			title: 'Imtihon nomi',
			dataIndex: 'name',
		},
		{
			title: 'Davomiyligi',
			dataIndex: 'duration',
		},
		{
			title: 'Kategoriya',
			dataIndex: 'category',
		},
		{
			title: 'Jami ball',
			dataIndex: 'totalMarks',
		},
		{
			title: 'Oʼtish ball',
			dataIndex: 'passingMarks',
		},
		{
			title: 'Harakat',
			dataIndex: 'action',
			render: (text, record) => (
				<div className='flex gap-2'>
					<i
						className='ri-pencil-line'
						onClick={() => navigate(`/admin/exams/edit/${record._id}`)}
					></i>
					<i className='ri-delete-bin-line' onClick={() => deleteExam(record._id)}></i>
				</div>
			),
		},
	];

	useEffect(() => {
		getExamsData();
		// eslint-disable-next-line
	}, []);
	return (
		<div>
			<div className='flex justify-between mt-2 items-end'>
				<PageTitle title='Imtihonlar' />

				<button
					className='primary-outlined-btn flex items-center'
					onClick={() => navigate('/admin/exams/add')}
				>
					<i className='ri-add-line'></i>
					Imtihonlarni qo'shish
				</button>
			</div>
			<div className='divider'></div>

			<Table columns={columns} dataSource={exams} />
		</div>
	);
}

export default Exams;

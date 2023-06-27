import { Table, message } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAllReports } from '../../../apicalls/reports';
import PageTitle from '../../../components/PageTitle';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';

function AdminReports() {
	const [reportsData, setReportsData] = useState([]);
	const dispatch = useDispatch();
	const [filters, setFilters] = useState({
		examName: '',
		userName: '',
	});

	const columns = [
		{
			title: 'Imtihon nomi',
			dataIndex: 'examName',
			render: (text, record) => <>{record.exam.name}</>,
		},
		{
			title: 'Foydalanuvchi nomi',
			dataIndex: 'userName',
			render: (text, record) => <>{record.user.name}</>,
		},
		{
			title: 'Sana',
			dataIndex: 'date',
			render: (text, record) => <>{moment(record.createdAt).format('DD-MM-YYYY hh:mm:ss')}</>,
		},
		{
			title: 'Jami ball',
			dataIndex: 'totalQuestions',
			render: (text, record) => <>{record.exam.totalMarks}</>,
		},
		{
			title: 'Oʼtish ball',
			dataIndex: 'correctAnswers',
			render: (text, record) => <>{record.exam.passingMarks}</>,
		},
		{
			title: 'Olingan ball',
			dataIndex: 'correctAnswers',
			render: (text, record) => <>{record.result.correctAnswers.length}</>,
		},
		{
			title: 'Holat',
			dataIndex: 'verdict',
			render: (text, record) => <>{record.result.verdict}</>,
		},
	];

	const getData = async tempFilters => {
		try {
			dispatch(ShowLoading());
			const response = await getAllReports(tempFilters);
			if (response.success) {
				setReportsData(response.data);
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
		getData(filters);
		// eslint-disable-next-line
	}, []);
	return (
		<div>
			<PageTitle title='Hisobotlar' />
			<div className='divider'></div>
			<div className='flex gap-2'>
				<input
					type='text'
					placeholder='Imtihon'
					value={filters.examName}
					onChange={e => setFilters({ ...filters, userName: e.target.value })}
				/>
				<input
					type='text'
					placeholder='Foydalanuvchi'
					value={filters.userName}
					onChange={e => setFilters({ ...filters, userName: e.target.value })}
				/>
				<button
					className='primary-outlined-btn'
					onClick={() => {
						setFilters({
							examName: '',
							userName: '',
						});
						getData({
							examName: '',
							userName: '',
						});
					}}
				>
					Tozalash
				</button>
				<button className='primary-contained-btn' onClick={() => getData(filters)}>
					Qidiruv
				</button>
			</div>
			<Table columns={columns} dataSource={reportsData} className='mt-2' />
		</div>
	);
}

export default AdminReports;

import { Table, message } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAllReportsByUser } from '../../../apicalls/reports';
import PageTitle from '../../../components/PageTitle';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';

function UserReports() {
	const [reportsData, setReportsData] = useState([]);
	const dispatch = useDispatch();

	const columns = [
		{
			title: 'Imtihon nomi',
			dataIndex: 'examName',
			render: (text, record) => <>{record.exam.name}</>,
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

	const getData = async () => {
		try {
			dispatch(ShowLoading());
			const response = await getAllReportsByUser();
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
		getData();
		// eslint-disable-next-line
	}, []);
	return (
		<div>
			<PageTitle title='Hisobotlar' />
			<div className='divider'></div>
			<Table columns={columns} dataSource={reportsData} />
		</div>
	);
}

export default UserReports;

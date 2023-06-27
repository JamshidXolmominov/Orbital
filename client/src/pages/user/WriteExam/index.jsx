import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getExamById } from '../../../apicalls/exams';
import { addReport } from '../../../apicalls/reports';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import Instructions from './Instructions';

function WriteExam() {
	const [examData, setExamData] = useState(null);
	const [questions = [], setQuestions] = useState([]);
	const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
	const [selectedOptions, setSelectedOptions] = useState({});
	const [result = {}, setResult] = useState({});
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const params = useParams();
	const [view, setView] = useState('instructions');
	const [secondsLeft = 0, setSecondsLeft] = useState(0);
	const [timeUp, setTimeUp] = useState(false);
	const [intervalId, setIntervalId] = useState(null);
	const { user } = useSelector(state => state.users);

	const getExamData = async () => {
		try {
			dispatch(ShowLoading());
			const response = await getExamById({
				examId: params.id,
			});
			dispatch(HideLoading());
			if (response.success) {
				setQuestions(response.data.questions);
				setExamData(response.data);
				setSecondsLeft(response.data.duration);
			} else {
				message.error(response.message);
			}
		} catch (error) {
			dispatch(HideLoading());
			message.error(error.message);
		}
	};

	const calculateResult = async () => {
		try {
			let correctAnswers = [];
			let wrongAnswers = [];

			questions.forEach((question, index) => {
				if (question.correctOption === selectedOptions[index]) {
					correctAnswers.push(question);
				} else {
					wrongAnswers.push(question);
				}
			});

			let verdict = 'Oʻtish';
			if (correctAnswers.length < examData.passingMarks) {
				verdict = 'Muvaffaqiyatsiz';
			}
			const tempResult = {
				correctAnswers,
				wrongAnswers,
				verdict,
			};
			setResult(tempResult);
			dispatch(ShowLoading());
			const response = await addReport({
				exam: params.id,
				result: tempResult,
				user: user._id,
			});
			dispatch(HideLoading());
			if (response.success) {
				setView('result');
			} else {
				message.error(response.message);
			}
		} catch (error) {
			dispatch(HideLoading());
			message.error(error.message);
		}
	};

	const startTimer = () => {
		let totalSeconds = examData.duration;
		const intervalId = setInterval(() => {
			if (totalSeconds > 0) {
				totalSeconds = totalSeconds - 1;
				setSecondsLeft(totalSeconds);
			} else {
				setTimeUp(true);
			}
		}, 1000);
		setIntervalId(intervalId);
	};

	useEffect(() => {
		if (timeUp && view === 'questions') {
			clearInterval(intervalId);
			calculateResult();
		}
		// eslint-disable-next-line
	}, [timeUp]);

	useEffect(() => {
		if (params.id) {
			getExamData();
		}
		// eslint-disable-next-line
	}, []);

	return (
		examData && (
			<div className='mt-2'>
				<div className='divider'></div>
				<h1 className='text-center'>{examData.name}</h1>
				<div className='divider'></div>

				{view === 'instructions' && (
					<Instructions examData={examData} setView={setView} startTimer={startTimer} />
				)}

				{view === 'questions' && (
					<div className='flex flex-col gap-2'>
						<div className='flex justify-between'>
							<h1 className='text-2xl'>
								{selectedQuestionIndex + 1} : {questions[selectedQuestionIndex].name}
							</h1>

							<div className='timer'>
								<span className='text-2xl'>{secondsLeft}</span>
							</div>
						</div>

						<div className='flex flex-col gap-2'>
							{Object.keys(questions[selectedQuestionIndex].options).map((option, index) => {
								return (
									<div
										className={`flex gap-2 flex-col ${
											selectedOptions[selectedQuestionIndex] === option
												? 'selected-option'
												: 'option'
										}`}
										key={index}
										onClick={() => {
											setSelectedOptions({
												...selectedOptions,
												[selectedQuestionIndex]: option,
											});
										}}
									>
										<h1 className='text-xl'>
											{option} : {questions[selectedQuestionIndex].options[option]}
										</h1>
									</div>
								);
							})}
						</div>

						<div className='flex justify-between'>
							{selectedQuestionIndex > 0 && (
								<button
									className='primary-outlined-btn'
									onClick={() => {
										setSelectedQuestionIndex(selectedQuestionIndex - 1);
									}}
								>
									Oldingi
								</button>
							)}

							{selectedQuestionIndex < questions.length - 1 && (
								<button
									className='primary-contained-btn'
									onClick={() => {
										setSelectedQuestionIndex(selectedQuestionIndex + 1);
									}}
								>
									Keyingisi
								</button>
							)}

							{selectedQuestionIndex === questions.length - 1 && (
								<button
									className='primary-contained-btn'
									onClick={() => {
										clearInterval(intervalId);
										setTimeUp(true);
									}}
								>
									Yuborish
								</button>
							)}
						</div>
					</div>
				)}

				{view === 'result' && (
					<div className='flex items-center mt-2 justify-center result'>
						<div className='flex flex-col gap-2'>
							<h1 className='text-2xl'>NATIJA</h1>
							<div className='divider'></div>
							<div className='marks'>
								<h1 className='text-md'>Jami ball : {examData.totalMarks}</h1>
								<h1 className='text-md'>Olingan ball :{result.correctAnswers.length}</h1>
								<h1 className='text-md'>Noto'g'ri javoblar : {result.wrongAnswers.length}</h1>
								<h1 className='text-md'>O'tish ball : {examData.passingMarks}</h1>
								<h1 className='text-md'>HOLAT : {result.verdict}</h1>

								<div className='flex gap-2 mt-2'>
									<button
										className='primary-outlined-btn'
										onClick={() => {
											setView('instructions');
											setSelectedQuestionIndex(0);
											setSelectedOptions({});
											setSecondsLeft(examData.duration);
										}}
									>
										Imtihonni qayta topshirish
									</button>
									<button
										className='primary-contained-btn'
										onClick={() => {
											setView('review');
										}}
									>
										Javoblarni ko'rib chiqish
									</button>
								</div>
							</div>
						</div>

						<div className='lottie-animation'>
							{result.verdict === 'Oʼtish' && (
								<lottie-player
									src='https://assets6.lottiefiles.com/packages/lf20_rc5d0f61.json'
									background='transparent'
									speed='1'
									loop
									autoplay
								></lottie-player>
							)}

							{result.verdict === 'Muvaffaqiyatsiz' && (
								<lottie-player
									src='https://assets4.lottiefiles.com/packages/lf20_qp1spzqv.json'
									background='transparent'
									speed='1'
									loop
									autoplay
								></lottie-player>
							)}
						</div>
					</div>
				)}

				{view === 'review' && (
					<div className='flex flex-col gap-2'>
						{questions.map((question, index) => {
							const isCorrect = question.correctOption === selectedOptions[index];
							return (
								<div className={`flex flex-col gap-1 p-2 ${isCorrect ? 'bg-success' : 'bg-error'}`}>
									<h1 className='text-xl'>
										{index + 1} : {question.name}
									</h1>
									<h1 className='text-md'>
										Taqdim etilgan javoblar : {selectedOptions[index]} -{' '}
										{question.options[selectedOptions[index]]}
									</h1>
									<h1 className='text-md'>
										To'g'ri Javoblar : {question.correctOption} -{' '}
										{question.options[question.correctOption]}
									</h1>
								</div>
							);
						})}

						<div className='flex justify-center gap-2'>
							<button
								className='primary-outlined-btn'
								onClick={() => {
									navigate('/');
								}}
							>
								Yopish
							</button>

							<button
								className='primary-contained-btn'
								onClick={() => {
									setView('instructions');
									setSelectedQuestionIndex(0);
									setSelectedOptions({});
									setSecondsLeft(examData.duration);
								}}
							>
								Imtihonni qayta topshirish
							</button>
						</div>
					</div>
				)}
			</div>
		)
	);
}

export default WriteExam;

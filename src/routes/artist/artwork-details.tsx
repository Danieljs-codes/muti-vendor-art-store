import { createFileRoute } from "@tanstack/react-router";
import { IconChevronLeft } from "justd-icons";
import { buttonStyles, Card, Carousel } from "ui";
import { Link } from "@tanstack/react-router";
import { getArtworkByIdQueryOptions } from "@server/query-options";
import { useSuspenseQueryDeferred } from "@/utils/use-suspense-query-deferred";
import { useServerFn } from "@tanstack/start";
import { getArtworkById$ } from "@server/artist";

export const Route = createFileRoute(
	"/_dashboard-layout-id/dashboard/artworks/$id",
)({
	loader: async ({ params, context }) => {
		context.queryClient.ensureQueryData(
			getArtworkByIdQueryOptions({ id: params.id }),
		);
	},
	component: RouteComponent,
});

function RouteComponent() {
	const params = Route.useParams();
	const getArtworkById = useServerFn(getArtworkById$);

	const {
		data: { artwork },
	} = useSuspenseQueryDeferred({
		...getArtworkByIdQueryOptions({ id: params.id }),
		queryFn: async () => {
			const res = await getArtworkById({
				data: {
					id: params.id,
				},
			});

			return res;
		},
	});

	return (
		<div>
			<div className="mb-6">
				<Link
					className={buttonStyles({
						appearance: "outline",
						size: "extra-small",
					})}
					to=".."
				>
					<IconChevronLeft />
					Back
				</Link>
			</div>
			<div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					<div>
						<Carousel
							className="w-full [&_.xrkr]:overflow-hidden [&_.xrkr]:flex [&_.xrkr]:flex-col h-full"
							opts={{
								loop: true,
							}}
						>
							<Carousel.Content
								items={artwork.images.map((image) => {
									return {
										id: image,
										url: image,
									};
								})}
							>
								{(item) => (
									<Carousel.Item id={item.id}>
										<Card className="overflow-hidden">
											<img
												className="rounded-md h-[20rem] lg:h-[40rem] object-center object-cover"
												src={item.url}
												alt={artwork.title}
											/>
										</Card>
									</Carousel.Item>
								)}
							</Carousel.Content>

							<Carousel.Handler>
								<Carousel.Button slot="previous" />
								<Carousel.Button slot="next" />
							</Carousel.Handler>
						</Carousel>
					</div>
				</div>
			</div>
		</div>
	);
}

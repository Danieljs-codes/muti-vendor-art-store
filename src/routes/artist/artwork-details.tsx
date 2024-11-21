import { createFileRoute } from "@tanstack/react-router";
import {
	IconChevronLeft,
	IconEye,
	IconMoneybag,
	IconPackage,
} from "justd-icons";
import { Badge, buttonStyles, Card, Carousel, cn, Separator } from "ui";
import { Link } from "@tanstack/react-router";
import { getArtworkByIdQueryOptions } from "@server/query-options";
import { useSuspenseQueryDeferred } from "@/utils/use-suspense-query-deferred";
import { useServerFn } from "@tanstack/start";
import { getArtworkById$ } from "@server/artist";
import { Blurhash } from "react-blurhash";
import { useState } from "react";
import { Balancer } from "react-wrap-balancer";
import { formatCurrency } from "@/utils/misc";
import { isNull } from "@server/utils";

interface ImageWithBlurhashProps {
	src: string;
	alt: string;
	blurhash: string;
	className?: string;
}

function ImageWithBlurhash({
	src,
	alt,
	blurhash,
	className,
}: ImageWithBlurhashProps) {
	const [imageLoaded, setImageLoaded] = useState(false);

	return (
		<div className="relative w-full h-full">
			<div
				className={`absolute inset-0 ${
					imageLoaded ? "opacity-0" : "opacity-100"
				} transition-opacity duration-500`}
			>
				<Blurhash
					hash={blurhash}
					width="100%"
					height="100%"
					resolutionX={32}
					resolutionY={32}
					punch={1}
				/>
			</div>
			<img
				src={src}
				alt={alt}
				className={cn(
					className,
					imageLoaded ? "opacity-100" : "opacity-0",
					"transition-opacity duration-500",
				)}
				onLoad={() => setImageLoaded(true)}
			/>
		</div>
	);
}

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
								items={artwork.images.map((image, index) => {
									return {
										id: image,
										url: image,
										blurhash: artwork.blurhashes[index],
									};
								})}
							>
								{(item) => (
									<Carousel.Item id={item.id}>
										<Card className="overflow-hidden">
											<ImageWithBlurhash
												src={item.url}
												alt={artwork.title}
												blurhash={item.blurhash}
												className="rounded-md h-[20rem] lg:h-[30rem] object-center object-cover w-full"
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
					<div>
						<div>
							<h1 className="text-2xl md:text-3xl font-bold">
								{artwork.title}
							</h1>
							<p className="mt-2 text-muted-fg">
								<Balancer>{artwork.description}</Balancer>
							</p>
							<div className="flex items-center gap-2">
								<Badge className="mt-4 capitalize" intent="secondary">
									Condition: {artwork.condition.toLowerCase()}
								</Badge>
								<Badge className="mt-4 capitalize" intent="secondary">
									Category: {artwork.category.toLowerCase()}
								</Badge>
							</div>
						</div>
						<Separator className="my-6" />
						<div className="flex gap-8">
							<div>
								<p className="text-muted-fg font-medium">Price</p>
								<div className="flex items-center gap-2">
									<IconMoneybag className="text-muted-fg size-4" />
									<h2 className="font-bold text-xl">
										{formatCurrency({ amount: artwork.price })}
									</h2>
								</div>
							</div>
							<div>
								<p className="text-muted-fg font-medium">Stock Left</p>
								<div className="flex items-center gap-2">
									<IconPackage className="text-muted-fg size-4" />
									<h2 className="font-bold text-xl">
										{isNull(artwork.stock)
											? "Unlimited"
											: artwork.stock === 0
												? "Sold Out"
												: artwork.stock}
									</h2>
								</div>
							</div>
						</div>
						<Separator className="my-6" />
						<div>
							<h3 className="text-lg font-semibold mb-2">Artwork Details</h3>
							<dl className="grid grid-cols-2 gap-x-4 gap-y-2">
								<dt className="text-sm font-medium text-gray-500">Views:</dt>
								<dd className="font-medium">{artwork.views} views</dd>
								<dt className="text-sm font-medium text-gray-500">
									Uploaded At:
								</dt>
								<dd className="font-medium">
									{new Date(artwork.createdAt).toLocaleDateString("en-NG", {
										day: "numeric",
										month: "short",
										year: "numeric",
									})}
								</dd>
								<dt className="text-sm font-medium text-gray-500">
									Dimensions:
								</dt>
								<dd className="font-medium">{artwork.dimensions}</dd>
								<dt className="text-sm font-medium text-gray-500">Weight:</dt>
								<dd className="font-medium">{artwork.weight}kg</dd>
								<dt className="text-sm font-medium text-gray-500">Category:</dt>
								<dd className="font-medium capitalize">
									{artwork.category.toLowerCase()}
								</dd>
								<dt className="text-sm font-medium text-gray-500">
									Condition:
								</dt>
								<dd className="font-medium capitalize">
									{artwork.condition.toLowerCase()}
								</dd>
							</dl>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
